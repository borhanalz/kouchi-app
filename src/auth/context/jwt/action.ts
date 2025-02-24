'use client';

import axios, {endpoints} from 'src/lib/axios';

import { setSession } from './utils';
import { JWT_STORAGE_KEY } from './constant';
import useEndPoints from "src/hooks/use-end-points";

// ----------------------------------------------------------------------

export type SignInParams = {
  mobileNumber: string;
  password: string;
};

export type SignUpParams = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

/** **************************************
 * Sign in
 *************************************** */
export const signInWithPassword = async ({ mobileNumber, password }: SignInParams): Promise<void> => {
  const endPoint=useEndPoints();
  try {
    const params = { mobileNumber, password };
    const res = await axios.post(endPoint.AUTH.SIGNIN, params);
    const { accessToken } = res.data;

    if (!accessToken) {
      throw new Error('Access token not found in response');
    }
    setSession(accessToken);
  } catch (error) {
    console.error('Error during sign in:', error);
    throw error;
  }
};

/** **************************************
 * Sign up
 *************************************** */
export const signUp = async ({
  email,
  password,
  firstName,
  lastName,
}: SignUpParams): Promise<void> => {
  const params = {
    email,
    password,
    firstName,
    lastName,
  };

  try {
    const res = await axios.post(endpoints.auth.signUp, params);

    const { accessToken } = res.data;

    if (!accessToken) {
      throw new Error('Access token not found in response');
    }

    sessionStorage.setItem(JWT_STORAGE_KEY, accessToken);
  } catch (error) {
    console.error('Error during sign up:', error);
    throw error;
  }
};

/** **************************************
 * Sign out
 *************************************** */
export const signOut = async (): Promise<void> => {
  try {
    await setSession(null);
  } catch (error) {
    console.error('Error during sign out:', error);
    throw error;
  }
};
