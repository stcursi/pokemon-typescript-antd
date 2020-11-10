import { Row, Col, Divider } from 'antd';
import Title from 'antd/lib/typography/Title';
import React, { useState } from 'react';
import PokemonTable from './PokemonTable';


function Home() {

    return <>
        <Row justify="center">
            <Col span={4}>
                <Title level={2}>Steph's Pokedex</Title>
            </Col>
        </Row>
        <Row>
            <Col span={24}>
                <PokemonTable />
            </Col>
        </Row>
    </>
}



export default Home;



