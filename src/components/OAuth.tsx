import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { FirebaseError } from 'firebase/app';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';

import { auth, db, GoogleAuthProvider, googleProvider, signInWithPopup } from '../config/firebase';

import Button from './Button';

export default function OAuth() {
  const navigate = useNavigate();

  const signInWithGoogleHandler = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);

      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      const user = result?.user;
      // console.log(result, user);

      // check for the user
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }
      navigate('/');
    } catch (error: unknown) {
      const firebaseError = error as FirebaseError;
      const errorCode = firebaseError?.code;
      const errorMessage = firebaseError?.message;
      toast.error(errorMessage || 'Something went wrong with the registration');
    }
  };

  return (
    <Button color='red' Icon={FcGoogle} onClick={signInWithGoogleHandler}>
      Sign with Google
    </Button>
  );
}
