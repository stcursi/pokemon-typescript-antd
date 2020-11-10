import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { Row, Col, Table, Select, Input, Space, Dropdown, Button, Menu, Modal, Typography, Tabs, Badge } from 'antd';
import { getPokemonTag, pokemonParser, pokemonTypes } from './utility/Pokemon';
import Column from 'antd/lib/table/Column';
import { Pokemon, PokemonFetch } from './interfaces/Pokemon';
const { Option } = Select;
const { Title, Text } = Typography;
const { Search } = Input;
const { TabPane } = Tabs;

let emptyPokemon: Pokemon;

const GET_POKEMONS = (name: string, after: string, limit: number) => gql`
query GetPokemons {
  pokemons(q: "${name}", after: "${after}", limit: ${limit}) {
    pageInfo {
        endCursor, hasNextPage
    }, edges {
      cursor, node {            
          id, name, types, classification, resistant, weaknesses, evolutions {
              name, id
          }, evolutionRequirements {
              amount, name
          }, attacks {
              fast {
                  name, damage, type
              },
              special {
                  name, damage, type
              }
          }
      }
    }
  }
}
`;

const GET_POKEMONS_TYPE = (type: string[], after: string, limit: number) => gql`
query GetPokemons {
  pokemonsByType(type: "${type}", after: "${after}", limit: ${limit}) {
    pageInfo {
        endCursor, hasNextPage
    }, edges {
        cursor, node {            
            id, name, types, classification, resistant, weaknesses, evolutions {
                name, id
            }, evolutionRequirements {
                amount, name
            }, attacks {
                fast {
                    name, damage, type
                },
                special {
                    name, damage, type
                }
            }
        }
    }
  }
}
`;

function PokemonTable() {

    const [typeToFilter, setTypeToFilter] = useState([]);
    const [nameToSearch, setNameToSearch] = useState("");
    const [currentPagination, setCurrentPagination] = useState({ after: "", limit: 10 });
    const [modalHandler, setModalHandler] = useState<{ visible: boolean, selectedPokemon: Pokemon }>();

    const { loading, error, data } = useQuery(typeToFilter && typeToFilter.length ? GET_POKEMONS_TYPE(typeToFilter, currentPagination.after, currentPagination.limit) :
        GET_POKEMONS(nameToSearch, currentPagination.after, currentPagination.limit));

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    const dataFetched: PokemonFetch = pokemonParser(data, typeToFilter && typeToFilter.length ? "pokemonsByType" : "pokemons"); // I know, it's horrible

    const filters = [];
    for (let pokemonType of pokemonTypes) {
        filters.push(<Option key={"type_" + pokemonType.value}
            value={pokemonType.value}
            label={pokemonType.text}>{pokemonType.text}</Option>);
    }

    const getPokemonByRecord = (record: any) => {
        for (let pk of dataFetched.data) {
            if (pk.id === record.id) {
                const pkToModal: Pokemon = pk;
                return pkToModal;
            }
        }

        return emptyPokemon;
    }

    const handleChange = (value: any) => {
        setTypeToFilter(value);
    }

    const onSearch = (value: any) => {
        setNameToSearch(value);
    };

    const onMore = () => {

        setCurrentPagination({
            limit: currentPagination.limit,
            after: dataFetched.lastCursor
        });
    };

    const onClickLimit = ({ key }: any) => {

        setCurrentPagination({
            limit: key,
            after: ""
        });
    }

    const menu = (
        <Menu onClick={onClickLimit}>
            <Menu.Item key="10">
                10
          </Menu.Item>
            <Menu.Item key="20">
                20
          </Menu.Item>
            <Menu.Item key="50">
                50
          </Menu.Item>
            <Menu.Item key="100">
                100
          </Menu.Item>
            <Menu.Item key="200">
                200
          </Menu.Item>
            <Menu.Item key="500">
                500
          </Menu.Item>
        </Menu>
    );

    const handleCloseModal = () => {
        setModalHandler({
            visible: false,
            selectedPokemon: emptyPokemon
        })
    }

    return <>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <Row>
                <Col offset={1} span={6}>
                    <Search
                        placeholder="Search by name"
                        allowClear
                        enterButton
                        defaultValue={nameToSearch}
                        size="large"
                        onSearch={onSearch}
                    />
                </Col>
                <Col span={6} push={1}>
                    <Select
                        mode="multiple"
                        allowClear
                        size="large"
                        style={{ width: '100%' }}
                        placeholder="Filter by type"
                        value={typeToFilter || []}
                        onChange={handleChange}
                    >
                        {filters}
                    </Select>

                </Col>
                <Col span={2} push={2}>
                    <Dropdown overlay={menu} placement="bottomCenter">
                        <Button type="dashed" size="large">Page size: {currentPagination.limit}</Button>
                    </Dropdown>
                </Col>
                <Col span={6} push={2}>
                    <Row justify="end">
                        <Space>
                            {currentPagination.after !== "" ? <Button type="default" size="large" onClick={() => setCurrentPagination({
                                after: "",
                                limit: 10
                            })}>Back to start</Button> : ""}
                            <Button disabled={!dataFetched.hasNext} type="primary" size="large" onClick={onMore}>More pokemon</Button>
                        </Space>
                    </Row>
                </Col>
            </Row>
            <Row>
                <Col offset={1} span={22}>
                    <Table dataSource={dataFetched.data} pagination={false}
                        onRow={(record, rowIndex) => {
                            return {
                                onClick: event => {
                                    setModalHandler({
                                        visible: true,
                                        selectedPokemon: getPokemonByRecord(record)
                                    })
                                }, // click row
                            };
                        }}
                        footer={() => <Row>
                            <Col>Pokemon displayed: {dataFetched.data.length}</Col>
                        </Row>}>
                        <Column title="ID" dataIndex="id" key="id" />
                        <Column title="Name" dataIndex="name" key="name"
                            render={(text: string, record: any, index: number) => {
                                return <Text style={{ color: "#1890ff" }} >{text}</Text>
                            }}
                            sorter={(a: any, b: any) => a.name.localeCompare(b.name)}
                        />
                        <Column title="Classification" dataIndex="classification" key="classification" />
                        <Column title="Types" dataIndex="types" key="types"
                            render={types => (
                                <>
                                    {types.map((type: string) => (type)).join(", ")}
                                </>
                            )}
                        />
                        <Column title="Resistant" dataIndex="resistant" key="resistant"
                            render={resistant => (
                                <>
                                    {resistant.map((res: string) => (res)).join(", ")}
                                </>
                            )}
                        />
                        <Column title="Weaknesses" dataIndex="weaknesses" key="weaknesses"
                            render={weaknesses => (
                                <>
                                    {weaknesses.map((waek: string) => (waek)).join(", ")}
                                </>
                            )}
                        />
                    </Table>
                </Col>
            </Row>
        </Space>
        <Modal
            title="Detail"
            visible={modalHandler ? modalHandler.visible : false}
            onCancel={handleCloseModal}
            footer={false}
        >
            {modalHandler?.selectedPokemon && <Space direction="vertical" size="large" style={{ width: "100%" }}>
                <Row justify="space-between">
                    <Col>
                        <Title level={4}>{modalHandler.selectedPokemon.name}</Title>
                        <p>{modalHandler.selectedPokemon.classification}</p>
                    </Col>
                    <Col>
                        {modalHandler.selectedPokemon.types.map((type) => getPokemonTag(type))}
                    </Col>
                </Row>
                <Row>
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="Evolutions" key="1">
                            {modalHandler.selectedPokemon.evolutionRequirements ?
                                <Row align="top">
                                    <Col span={24}>
                                        <Title level={5}>Evolution requirements</Title>
                                    </Col>
                                    <Space size="large">
                                        <Col>
                                            <Text type="secondary">{modalHandler.selectedPokemon.evolutionRequirements.name}</Text>
                                        </Col>
                                        <Col>
                                            <Badge style={{ backgroundColor: '#52c41a' }} count={modalHandler.selectedPokemon.evolutionRequirements.amount}></Badge>
                                        </Col>
                                    </Space>
                                </Row> : <Row>
                                    <Text strong>This pokemon doesn't have evolutions</Text>
                                </Row>}
                            {modalHandler.selectedPokemon.evolutions && modalHandler.selectedPokemon.evolutions.length ?
                                <><Row>
                                    <Col span={24}>
                                        <Title level={5}>Evolutions</Title>
                                    </Col>
                                </Row>
                                    {modalHandler.selectedPokemon.evolutions.map(ev => <Row>
                                        <Col>
                                            <Text type="secondary">{ev.name}</Text>
                                        </Col>
                                    </Row>)}
                                </> : ""}
                        </TabPane>
                        <TabPane tab="Attacks" key="2">
                            <Row>
                                <Col span={24}>
                                    <Title level={5}>Fast Attacks</Title>
                                </Col>
                            </Row>
                            {modalHandler.selectedPokemon.attacks &&
                                modalHandler.selectedPokemon.attacks.fast.map(fastAttack => <Space direction="vertical" size="large" style={{ width: "100%" }}>
                                    <Row justify="space-between" align="top">
                                        <Col>
                                            <Space size="middle">
                                                <Text type="secondary">{fastAttack.name}</Text>
                                                <Text type="danger">Damage: </Text>
                                                <Badge count={fastAttack.damage}></Badge>
                                            </Space>
                                        </Col>
                                        <Col>
                                            {getPokemonTag(fastAttack.type)}
                                        </Col>
                                    </Row>
                                </Space>)}
                            <Row style={{ marginTop: "10px" }}>
                                <Col span={24}>
                                    <Title level={5}>Special Attacks</Title>
                                </Col>
                            </Row>
                            {modalHandler.selectedPokemon.attacks &&
                                modalHandler.selectedPokemon.attacks.special.map(specialAttack => <Space direction="vertical" size="large" style={{ width: "100%" }}>
                                    <Row justify="space-between" align="top">
                                        <Col>
                                            <Space size="middle">
                                                <Text type="secondary">{specialAttack.name}</Text>
                                                <Text type="danger">Damage: </Text>
                                                <Badge count={specialAttack.damage}></Badge>
                                            </Space>
                                        </Col>
                                        <Col>
                                            {getPokemonTag(specialAttack.type)}
                                        </Col>
                                    </Row>

                                </Space>)}
                        </TabPane>
                    </Tabs>
                </Row>
            </Space>}
        </Modal>
    </>
}



export default PokemonTable;
