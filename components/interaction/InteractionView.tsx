import React, {useEffect} from 'react';

import {Env, envWithDefaultOf, GaiaUrl} from '@environment/Environment';

import {EmitterAware} from "@lib/emitter/Emitter";

import {IReceptionMessage} from "@convey/model/reception/IReceptionMessage";
import ReceptionMessage from "@convey/model/reception/ReceptionMessage";

import {ConveyWrapper} from "@convey/ConveyWrapper";
import {ConveyProperties} from "@convey/ConveyProperties";

import InteractionContent from "@components/interaction/InteractionContent";

import ConnectionModal from "@components/modal/ConnectionModal";

import {Url} from "@utils/Url";

import './InteractionView.css';

export default function (props: EmitterAware) {
    let conveyWrapper: ConveyWrapper | null = null;

    useEffect(() => {
        const receptionMessage: IReceptionMessage | undefined = ReceptionMessage.get();
        if (!receptionMessage) return;

        const properties = new ConveyProperties();
        properties.set("Template_Property", "template");

        fetch("/env.json")
                .then(value => value.json())
                .then(data => {
                    const url = data.gaia_url;
                    const identityId = data.gaia_identity_id;
                    const username = data.gaia_username;
                    const password = data.gaia_password;
                    const wait_timout = data.gaia_wait_timeout;
                    const environment = envWithDefaultOf(Url.getParam("env") || data.gaia_env, Env.PROD);

                    connect(url, identityId, receptionMessage, environment, username, password, parseInt(wait_timout), properties);
                }).catch(reason => {
            console.warn(`Unable to retrieve environment: ${reason}`);
            connect(GaiaUrl.LOCAL,
                    "",
                    receptionMessage, Env.DEV,
                    null,
                    null,
                    60000,
                    properties);
        });

        // clean-up on unmount
        return (() => {
            conveyWrapper && conveyWrapper.disconnect();
        })
    }, []);

    function connect(gaiaUrl: string,
                     gaiaIdentityId: string,
                     receptionPayload: object,
                     environment: Env,
                     username: string | null = null,
                     password: string | null = null,
                     wait_timeout: number | null = null,
                     properties: ConveyProperties = new ConveyProperties()) {
        if (gaiaUrl && gaiaIdentityId) {
            conveyWrapper = ConveyWrapper.init(gaiaUrl, gaiaIdentityId, username, password);
            conveyWrapper.connect(receptionPayload, environment, props.emitter, wait_timeout || 60000, properties);
        } else {
            console.error("Unable to connect to server")
        }
    }

    return (
            <div>
                <ConnectionModal/>
                <InteractionContent emitter={props.emitter}/>
            </div>
    )
}
