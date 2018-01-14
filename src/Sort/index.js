import React from 'react';
import classNames from 'classnames';
import Button from '../Button';
import PropTypes from 'prop-types';

const Sort = ({sortKey, onSort, activeSortKey, children}) => {
	const sortClasses = classNames(
    'button-inline',
    { 'button-active': activeSortKey === sortKey }
  );
  return (
    <Button onClick={() => onSort(sortKey)} className={sortClasses}>
      {children}
    </Button>
  );
};

Sort.propTypes = {
  sortKey: PropTypes.string.isRequired,
  onSort: PropTypes.func.isRequired,
  activeSortKey: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
}

export default Sort;