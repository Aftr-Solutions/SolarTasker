import React, { useEffect } from 'react'
import Header from '../../components/Header/Header';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRegions } from '../../store/ActionApis/regionApi';

const Region = () => {
  const dispatch = useDispatch();

  const { regions } = useSelector((state) => state.region);

  useEffect(() => {
    dispatch(fetchRegions());
  }, []);

  return <div><Header /></div>;
};

export default Region;
