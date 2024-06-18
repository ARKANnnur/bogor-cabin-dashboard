/* eslint-disable react/prop-types */
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

import useUser from '../features/authentication/useUser';
import Spinner from './Spinner';
import { useEffect } from 'react';

const FullPage = styled.div`
  height: 100dvh;
  background-color: var(--color-grey-50);
  display: flex;
  justify-content: center;
  align-items: center;
`;

function ProtectedRoute({ children }) {
  const navigate = useNavigate();

  // 1.Load the autenticated user
  const { isLoading, isAuthenticated } = useUser();

  // 3.If there is No authenticated user, redirect to the Login
  useEffect(() => {
    if (!isAuthenticated && !isLoading) navigate('/login');
  }, [isAuthenticated, isLoading, navigate]);

  // 2.While a loading show spinner
  if (isLoading)
    return (
      <FullPage>
        <Spinner />
      </FullPage>
    );

  // 4.If there is answer, render the app

  if (isAuthenticated) return children;
}

export default ProtectedRoute;
