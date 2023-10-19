import auth from '@react-native-firebase/auth';
export function firebaseAuth() {
  const UserFirebaseAuth = auth()
    .signInAnonymously()
    .then((res) => {
      console.log('User signed in anonymously', res);
    })
    .catch((error) => {
      if (error.code === 'auth/operation-not-allowed') {
        console.log('Enable anonymous in your firebase console.');
      }

      console.error(error);
    });
  return {UserFirebaseAuth};
}
