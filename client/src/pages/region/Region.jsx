import React from 'react'
import Header from '../../components/Header/Header';

const Region = () => {
  const dispatch = useDispatch();

  const { regions } = useSelector((state) => state.region);

  console.log(regions);

  useEffect(() => {
    dispatch(fetchRegions());
  }, [dispatch]);

  return <div><Header /></div>;
};

export default Region;
