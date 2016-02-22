'use strict';

const benchmark = require('benchmark')
  , component = require('../src/index')
  , reactDom = require('react-dom/server')

  , BREADTH = 11
  , DEPTH = 4

  , suite = new benchmark.Suite();

const comp = component.create({
  render (props) {
    const breadth = props.breadth
      , depth = props.depth;

    if (depth <= 0) {
      return component.el.div(null, 'abcdefghi');
    }

    let children = [];

    for (let i = 0; i < breadth; i++) {
      children.push(comp({ key: i, depth: depth - 1, breadth }));
    }
    return component.el.div({ children, onClick: this.onClick });
  },

  onClick () {
    console.log('click');
  }
});

function render () {
  return reactDom.renderToString(comp({ depth: DEPTH, breadth: BREADTH }));
}

suite
  .add({ name: 'comp', fn: render })
  .on('complete', function () {
      for (let i = 0; i < this.length; i++) {
        const benchmark = this[i];

        console.log(benchmark.name);
        console.log(`Mean:    ${Math.round(benchmark.stats.mean * 1000)} ms`);
        console.log(`Std Dev: ${Math.round(benchmark.stats.deviation * 1000)} ms\n`);
      }
    })
  .run({ async: true });