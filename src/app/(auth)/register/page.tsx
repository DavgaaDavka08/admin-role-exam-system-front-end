"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserRegister } from "@/lib/auth/register";
import React, { useState } from "react";
import { toast } from "sonner";

const register = async () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const addHandler = async () => {
    if (!email || !password) {
      return toast.error("email and password is not valid");
    }
    await UserRegister(email, password);
  };
  return (
    <div>
      <Input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        type="text"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Input type="text" />
      <Button onClick={addHandler}>add</Button>
    </div>
  );
};

export default register;
