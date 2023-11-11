import { Suspense, lazy } from 'react';
import Sidebar from '../../shared/layouts/sidebar';
import { Route, Switch } from 'react-router-dom';

const Home = lazy(() => import('./home'));

const FeatureRoutes = () => {
  return (
    <div className='flex'>
      <Sidebar />
      <div className='flex-1'>
        <Suspense fallback={null}>
          <Switch>
            <Route
              path='/'
              component={Home}
            />
          </Switch>
        </Suspense>
      </div>
    </div>
  );
};

export default FeatureRoutes;
