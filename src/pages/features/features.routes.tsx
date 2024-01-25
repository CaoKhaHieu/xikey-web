import { Suspense, lazy } from 'react';
import { Switch } from 'react-router-dom';

import Sidebar from '../../shared/layouts/sidebar';
import AuthRoute from '@/routes/AuthRoute';

const Home = lazy(() => import('./home'));
const Chat = lazy(() => import('./chat'));

const FeatureRoutes = () => {
  return (
    <div className='flex'>
      <Sidebar />
      <div className='flex-1'>
        <Suspense fallback={null}>
          <Switch>
            <AuthRoute
              path='/'
              exact
              component={Home}
            />
            <AuthRoute
              path='/chat/:id'
              component={Chat}
            />
          </Switch>
        </Suspense>
      </div>
    </div>
  );
};

export default FeatureRoutes;
