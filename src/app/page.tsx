'use client';
import * as React from 'react';
import LoginContainer from '@/components/login/loginContainer';
import { useState } from 'react';

export default function Home() {
  const [signIn, setSignIn] = useState(false);
  return (
    <div>
          <LoginContainer isSignIn={signIn} setSignIn={setSignIn}/>
    </div>
  )
}
