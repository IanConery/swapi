import React, { Component } from 'react';
import axios from 'axios';
import {
  VictoryChart,
  VictoryBar,
  VictoryTheme,
  VictoryAxis,
  VictoryLabel
} from 'victory';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { data: [] };
  };

  async componentDidMount() {
    const getData = async (url) => {
      try {
        const { data } = await axios.get(url);
        return data;
      } catch(error) {
        console.error(error);
      }
    };
    let planets = [];
    let url = 'https://swapi.co/api/planets';

    do {
      const response = await getData(url);
      url = response.next;
      planets = planets.concat(response.results);
    } while(url);

    planets = planets.filter(({ population }) => population !== 'unknown')
      .map(({ name, population }) => ({ name, population }))
      .sort((a, b) => parseFloat(a.population) - parseFloat(b.population));

      this.setState({ data: planets });
  };

  render() {
    const formatNumber = (num) => {
      const fixed = parseFloat((num/100000).toFixed(2));
      return parseInt(fixed) === fixed ? parseInt(fixed) : fixed;
    };

    return (
      <div className="App">

        <VictoryChart theme={ VictoryTheme.material }>
          <VictoryLabel
            x={ 175 }
            y={ 30 }
            text='Population of Star Wars Planets'
            textAnchor='middle'
          />

          <VictoryAxis dependentAxis
            label='hundred thousand'
            tickFormat={(x) => (x === 0 ? 0 : formatNumber(x) )}
            style={{
              tickLabels: { fontSize: 4, angle: '-75' },
              axisLabel: { fontSize: 3, padding: 20 }
            }}
          />

          <VictoryAxis
            style={{ tickLabels: { fontSize: 5 } }}
          />

          <VictoryBar horizontal
            x='name'
            y='population'
            data={ this.state.data }
          />
        </VictoryChart>

      </div>
    );
  };
};

export default App;
