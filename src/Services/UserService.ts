import { IUserModel } from '../Interfaces/IUserModel';
import { IApiResponse } from '../Interfaces/IApiResponse';
import { IChangeProfileModel } from '../Interfaces/IChangeProfileModel';
import { http, HttpResponse } from './http';
import { createApiResponse } from './tools';
import { ILeaderboardEntry } from '../Interfaces/ILeaderboardEntry';

export async function getUsers(): Promise<IUserModel[]> {
  const result = await http<IUserModel[]>({
    path: '/User',
  });
  if (result && result.body) {
    return result.body;
  }
  return [];
}

export async function getUser(email: string): Promise<IUserModel | null> {
  const response = await http<IUserModel | null>({
    path: `/User/ByEmail/${email}`,
  });
  if (response && response.body && response.ok) {
    return response.body;
  }
  return null;
}

export async function getUserById(id: string): Promise<IUserModel | null> {
  const response = await http<IUserModel | null>({
    path: `/User/ById/${id}`,
  });
  if (response && response.ok && response.body) {
    return response.body;
  }
  return null;
}

export async function GetUserModel(
  email: string,
  identifier: string,
  startingBalance: number,
  token?: string,
): Promise<IUserModel | null> {
  if (email) {
    const result = await http<IUserModel>({
      path: `/User/ByEmail/${encodeURIComponent(email)}`,
      token: token,
    });
    if (result.ok && result.body) {
      if (result.body.identifier) {
        return result.body;
      }
      // need to update user with identifier
      const updatedUser = result.body;
      updatedUser.identifier = identifier;
      const updateResult = await http<IUserModel, IUserModel>({
        path: '/User/UpdateIdentifier',
        method: 'put',
        body: updatedUser,
        token: token,
      });
      if (updateResult && updateResult.ok && updateResult.body) {
        return updateResult.body;
      }
      console.error(updateResult.body);
      return null;
    }
    const newUser: IUserModel = {
      id: '',
      email: email,
      identifier: identifier,
      displayName: email,
      firstName: '',
      lastName: '',
      dateJoined: new Date().toISOString(),
      balance: startingBalance,
      owedToExchange: 0,
      isAdmin: false,
    };
    const createResult = await http<IUserModel, IUserModel>({
      path: '/User',
      method: 'post',
      body: newUser,
      token: token,
    });
    if (createResult.ok && createResult.body) {
      return createResult.body;
    }
    console.error(createResult);
  }
  return null;
}

export async function updateUserModel(
  model: IChangeProfileModel,
  token: string,
): Promise<HttpResponse<any>> {
  const response = await http<any, IChangeProfileModel>({
    path: '/User/ChangeProfile',
    method: 'put',
    body: model,
    token: token,
  });
  return response;
}

export async function toggleAdmin(
  userid: string,
  token: string,
): Promise<IApiResponse> {
  const response = await http<IApiResponse>({
    path: `/User/Toggle/${userid}`,
    method: 'put',
    token: token,
  });
  return createApiResponse(response);
}

export async function createUser(
  user: IUserModel,
): Promise<HttpResponse<IUserModel | IApiResponse>> {
  const response = await http<IUserModel | IApiResponse, IUserModel>({
    path: '/User',
    method: 'post',
    body: user,
  });
  return response;
}

export async function getNameFromEmail(email: string): Promise<string> {
  const response = await http<string>({
    path: `/User/Name/email/${email}`,
  });
  if (response && response.body) {
    return response.body;
  }
  return '';
}

export async function getNameFromIdentifier(
  identifier: string,
): Promise<string> {
  const response = await http<string>({
    path: `/User/Name/identifier/${identifier}`,
  });
  if (response && response.body) {
    return response.body;
  }
  return '';
}

export async function takeOutLoan(
  userid: string,
  amount: number,
  token: string,
): Promise<IApiResponse> {
  const response = await http<IApiResponse>({
    path: `/User/Loan/${userid}/${amount}`,
    method: 'put',
    token: token,
  });
  return createApiResponse(response);
}

export async function repayLoan(
  userid: string,
  amount: number,
  token: string,
): Promise<IApiResponse> {
  const response = await http<IApiResponse>({
    path: `/User/Repay/${userid}/${amount}`,
    method: 'put',
    token: token,
  });
  return createApiResponse(response);
}

export async function resetUsers(token: string): Promise<IApiResponse> {
  const response = await http<IApiResponse>({
    path: '/User/Reset',
    method: 'post',
    token: token,
  });
  return createApiResponse(response);
}

export async function getLeaderboard() {
  const response = await http<ILeaderboardEntry[]>({
    path: '/User/Leaderboard',
  });
  if (response && response.ok && response.body) {
    return response.body;
  }
  console.error('Failed to retrieve leaderboard', response);
  return [];
}
