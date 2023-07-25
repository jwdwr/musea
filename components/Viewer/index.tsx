"use client";
import React, { PropsWithChildren } from "react";
import { Canvas } from "@react-three/fiber";
import "./Viewer.css";
import { Museum } from "../Museum";

export function Viewer({ children }: PropsWithChildren) {
  return (
    <Canvas id="Viewer">
      <Museum width={5} length={5} />
    </Canvas>
  );
}
