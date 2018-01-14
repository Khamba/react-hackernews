import React from 'react';
import ReactDOM from 'react-dom';
import App from '../App';
import Search from '../Search';
import Button from '../Button';
import Table from '../Table';
import renderer from 'react-test-renderer';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('App', () => {
	it('renders without crashing', () => {
	  const div = document.createElement('div');
	  ReactDOM.render(<App />, div);
	});

	test('has a valid snapshot', () => {
		const component = renderer.create(
			<App />
		);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
	});
});

describe('Search', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Search />, div);
  });

  it('has a valid snapshot', () => {
    const component = renderer.create(
      <Search />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('Button', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Button />, div);
  });

  it('has a valid snapshot', () => {
    const component = renderer.create(
      <Button />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders one button', () => {
    const element = shallow( <Button /> );
    expect(element.find('button').length).toBe(1);
  });

});

describe('Table', () => {

  const props = {
    list: [
      { objectID: '1', url: 'url1', title: 'title1', author: 'author1', num_comments: 1, points: 1 },
      { objectID: '2', url: 'url2', title: 'title2', author: 'author2', num_comments: 2, points: 2 },
      { objectID: '3', url: 'url3', title: 'title3', author: 'author3', num_comments: 3, points: 3 }
    ]
  };

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Table {...props} />, div);
  });

  it('has a valid snapshot', () => {
    const component = renderer.create(
      <Table {...props} />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('shows two elements in list', () => {
    const element = shallow( <Table {...props} /> );
    expect(element.find('.table-row').length).toBe(3);
  });
})
