import { userApi } from '@/services/apis.service';

export const createUser = async (data: any) => {
  try {
    const response = await userApi.post('users', data);
    return {
      data: response.data,
    };
  } catch (error) {
    console.log(error);
    return {
      error: (error as { response: { data: { message: string } } }).response
        ?.data?.message! as string,
    };
  }
};

export const loginWithEmailAndPassword = async (
  email: string,
  password: string,
) => {
  try {
    const response = await userApi.post('auth/login', { email, password });
    return response;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const loginWithFederatedProvider = async (accessToken: string) => {
  try {
    const response = await userApi.post('auth/login/federated', {
      accessToken,
    });
    console.log('Login response: ', response.data);
    return response;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getUsers = async (token: string) => {
  try {
    const response = await userApi.get('/users', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch users:', error);
    throw error;
  }
};

export const updateUserRole = async (
  userId: string,
  newRole: string,
  token: string,
) => {
  try {
    const response = await userApi.patch(
      `/users/${userId}/role`,
      {
        role: newRole,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Failed to update user role:', error);
    throw error;
  }
};

export const forgotPassword = async (data: any) => {
  try {
    const response = await userApi.post('/auth/forgot-password', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (data: any) => {
  try {
    const response = await userApi.put('/auth/reset-password', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const subscribeJourney = async ({
  userId,
  journeyId,
  accessToken,
}: {
  userId: string;
  journeyId: string;
  accessToken: string;
}) => {
  try {
    const response = await userApi.post(
      `/users/${userId}/subscribe/${journeyId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response.data;
  } catch (err) {
    console.log('Failed to subscribe to journey: ', err);
    throw err;
  }
};

export const getSubscribedJourneys = async (userId: string) => {
  try {
    const response = await userApi.get(`/users/${userId}/subscribedJourneys`);
    return response.data;
  } catch (error) {
    console.log('Error fetched journeys');
    throw error;
  }
};

export const getCompletedTrails = async (userId: string) => {
  try {
    const response = await userApi.get(`/users/${userId}/completedTrails`);
    return response.data;
  } catch (error) {
    console.error('Error fetching Trails');
    throw error;
  }
};

export const completeTrail = async ({
  userId,
  trailId,
  accessToken,
}: {
  userId: string;
  trailId: string;
  accessToken: string;
}) => {
  try {
    const response = await userApi.post(
      `/users/${userId}/complete/${trailId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response.data;
  } catch (err) {
    console.log('Failed to append trail: ', err);
    throw err;
  }
};
