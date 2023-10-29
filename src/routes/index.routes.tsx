import { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';

const FeatureRoutes = lazy(() => import('../pages/features/features.routes'));

const Routes = () => {
  return (
    <Suspense fallback={null}>
      <Switch>
        {/* <Route path='/auth' component={AuthRoutes} /> */}
        <Route path='/' component={FeatureRoutes} />
      </Switch>
    </Suspense>
  );
};

export default Routes;
