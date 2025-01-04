import React from 'react'

const Region = () => {
  const dispatch = useDispatch();

  const { regions } = useSelector((state) => state.region);

  console.log(regions);

  useEffect(() => {
    dispatch(fetchRegions());
  }, [dispatch]);

  return <div>Region</div>;
};

export default Region;
