import React, { useState, useEffect } from 'react';
import { signInWithPopup, User, onAuthStateChanged, signOut, GoogleAuthProvider } from 'firebase/auth';
import { getFirebaseAuth, getGoogleProvider } from '../lib/firebase';
import { useAppStore } from '../store';
import { v4 as uuidv4 } from 'uuid';

export default function GoogleContactSync() {
  const [user, setUser] = useState<User | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const store = useAppStore();

  useEffect(() => {
    try {
      const auth = getFirebaseAuth();
      const unsubscribe = onAuthStateChanged(auth, setUser);
      return () => unsubscribe();
    } catch (e) {
      console.error("Firebase auth initialization failed", e);
      return () => {};
    }
  }, []);

  const handleSignInAndSync = async () => {
    try {
      setIsSyncing(true);
      const auth = getFirebaseAuth();
      const googleProvider = getGoogleProvider();
      
      // Wait for sign in
      const result = await signInWithPopup(auth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (!credential || !credential.accessToken) {
        throw new Error("No access token returned");
      }
      
      const token = credential.accessToken;
      await syncContacts(token);
    } catch (error) {
      console.error("Error signing in or syncing", error);
    } finally {
      setIsSyncing(false);
    }
  };

  const syncContacts = async (accessToken: string) => {
    try {
      // https://developers.google.com/people/api/rest/v1/people.connections/list
      const res = await fetch('https://people.googleapis.com/v1/people/me/connections?personFields=names,emailAddresses,phoneNumbers&pageSize=1000', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      });
      if (!res.ok) {
        throw new Error("Failed to fetch Google contacts");
      }
      const data = await res.json();
      const connections = data.connections || [];
      
      let syncedCount = 0;
      
      connections.forEach((conn: any) => {
        if (!conn.names || conn.names.length === 0) return;
        const name = conn.names[0];
        const firstName = name.givenName || '';
        const lastName = name.familyName || '';
        
        if (!firstName) return;

        // Skip if a contact with same exact name exists (basic dupe check)
        // Store contacts:
        const allContacts = Object.values(store.contacts);
        const exists = allContacts.find(c => c.first_name === firstName && c.last_name === lastName);
        
        if (!exists) {
          store.addContact({
            id: uuidv4(),
            user_id: 'user_1',
            first_name: firstName,
            last_name: lastName,
            domain: 'personal',
            circle: 'orbit',
            lifecycle_stage: 'incubation',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
          syncedCount++;
        }
      });
      
      console.log(`Synced ${syncedCount} new contacts`);
    } catch (error) {
      console.error("Sync error", error);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <button 
        onClick={handleSignInAndSync}
        disabled={isSyncing}
        className="gsi-material-button flex items-center justify-center p-0 bg-white text-[#3c4043] border border-[#dadce0] rounded-[4px] h-[40px] font-medium transition-colors hover:bg-[#f8f9fa] disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
      >
        <div className="flex items-center px-3 h-full">
          <div className="flex items-center justify-center w-[18px] h-[18px] mr-3">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{display: 'block'}}>
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
              <path fill="none" d="M0 0h48v48H0z"></path>
            </svg>
          </div>
          <span className="text-[14px]">
            {isSyncing ? "Syncing Contacts..." : "Sync with Google Contacts"}
          </span>
        </div>
      </button>
      {user && (
        <div className="text-xs text-on-surface/50 font-serif flex items-center gap-2">
          Signed in as {user.email} <button onClick={() => {
            try { signOut(getFirebaseAuth()) } catch(e) {}
          }} className="underline hover:text-black focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black rounded px-1 -mx-1">Sign out</button>
        </div>
      )}
    </div>
  );
}
