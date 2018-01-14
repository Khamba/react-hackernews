import React, { Component } from 'react';
import './App.css';
import fetch from 'isomorphic-fetch';
import Table from '../Table';
import Button from '../Button';
import Search from '../Search';

const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = 5;

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

const updateSetSearchTopStoriesState = (page, hits) => (prevState) => {
  const { results, searchKey } = prevState;
  const prevHits = results[searchKey] ? results[searchKey].hits : [] ;
  const updatedHits = [ ...prevHits, ...hits ];
  return {
    results: { 
      ...results, 
      [searchKey]: { hits: updatedHits, page }
    },
    isLoading: false
  };
}

const updateOnDismissState = (id) => (prevState) => {
  const { searchKey, results } = prevState;
  const { hits, page } = results[searchKey];
  const updatedHits = hits.filter(item => item.objectID !== id);
  return {
    results: {
      ...results,
      [searchKey]: {
        hits: updatedHits,
        page
      }
    }
  }
}

class App extends Component {

  constructor(props){
    super(props);

    this.state = {
      results: {},
      searchKey: '',
      searchTerm: DEFAULT_QUERY,
      error: null,
      isLoading: false,
    }

    this.needsToSearch = this.needsToSearch.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this)
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this)
    this.onDismiss = this.onDismiss.bind(this);
  }

  needsToSearch(searchKey){
    return !this.state.results[searchKey];
  }

  setSearchTopStories(result){
    const {
      page,
      hits
    } = result;
    this.setState(updateSetSearchTopStoriesState(page, hits));
    
  }

  fetchSearchTopStories(searchTerm, page = 0){
    this.setState({ isLoading: true });
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`).then(
      response => response.json()
    ).then(
      result => this.setSearchTopStories(result)
    ).catch(e => this.setState({ error: e }));
  }

  onDismiss(id){
    this.setState(updateOnDismissState(id));
  }

  onSearchSubmit(event){
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    if(this.needsToSearch(searchTerm)){
      this.fetchSearchTopStories(searchTerm);
    }
    event.preventDefault();
  }

  componentDidMount(){
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchSearchTopStories(searchTerm);
  }

  onSearchChange(event){
    this.setState({
      searchTerm: event.target.value
    });
  }

  render() {
    const {
      results,
      searchTerm,
      searchKey,
      error,
      isLoading,
    } = this.state

    const page = (results[searchKey] && results[searchKey].page) || 0;
    const result = (results[searchKey] && results[searchKey].hits) || [];

    return (
      <div className="page">
        <div className="interactions">
          <Search value={searchTerm} onChange={this.onSearchChange} onSubmit={this.onSearchSubmit}>
          Search
        </Search>
        </div>
        { error ? 
          <div className="interaction"> <p> Something Went Wrong! </p> </div>  : 
          <Table 
            list={result} 
            onDismiss={this.onDismiss} 
          /> 
        }
        <div className="interactions">
          <ButtonWithLoading isLoading={isLoading} onClick={() => this.fetchSearchTopStories(searchKey, page+1)}>
            More
          </ButtonWithLoading>
        </div>
      </div>
    );
  }
}

const Loading = () => <div> Loading... </div>

const withLoading = (Component) => ({ isLoading, ...restProps }) =>
  isLoading ? <Loading /> : <Component {...restProps} />

const ButtonWithLoading = withLoading(Button);

export default App;
