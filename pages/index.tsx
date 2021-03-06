import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

import {testStyle} from 'style/TestStyle';

import _JSXStyle from 'styled-jsx/style'

import InteractionView from "@components/interaction/InteractionView";
import Layout from '@layout/Layout';

import {EmitterContext} from "@lib/emitter/EmitterContext";

export default function () {
    return (
            <div>
                <link href="https://fonts.googleapis.com/css?family=Oswald|Roboto&display=swap" rel="stylesheet"/>

                <_JSXStyle>{testStyle}</_JSXStyle>
                <EmitterContext.Consumer>
                    {(emitter) => (
                            <Layout
                                    title={"conveyjs-starter"}
                                    emitter={emitter}
                            >
                                <InteractionView emitter={emitter}/>
                                <div/>
                            </Layout>
                    )}
                </EmitterContext.Consumer>
            </div>
    )
}
