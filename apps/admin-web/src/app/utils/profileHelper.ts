import { Profile } from '@caribou-crew/mezzo-interfaces';
import { PROFILE_NAMESPACE } from '@caribou-crew/mezzo-constants';

const profileNamespace = PROFILE_NAMESPACE;

export const getLocalProfiles = () => {
  const data: Profile[] =
    JSON.parse(localStorage.getItem(profileNamespace) || '[]') ?? [];
  return data;
};

export const saveLocalProfile = (profile: Profile) => {
  const data: Profile[] =
    JSON.parse(localStorage.getItem(profileNamespace) || '[]') ?? [];
  console.log('Input: ', profile);
  console.log('Got data: ', data);
  const newData = [...data.filter((i) => i.name !== profile.name), profile];
  localStorage.setItem(profileNamespace, JSON.stringify(newData));
  // Display save success message?
};

export const deleteLocalProfile = (name: string) => {
  const data: Profile[] =
    JSON.parse(localStorage.getItem(profileNamespace) || '[]') ?? [];
  const newData = data.filter((i) => i.name !== name);
  localStorage.setItem(profileNamespace, JSON.stringify(newData));
  // localStorage.removeItem(name);
};

// export const toProfileData = (routes: Route)
