import { Request, Response } from 'express';

const allowedIPs = ["34.211.200.85", "172.68.174.97", "10.220.167.165"];
  
export const verifyIP = (req:Request) => {
    const forwarded = req.headers["x-forwarded-for"];
    const ip = (Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(",")[0]?.trim()) || req.socket.remoteAddress || "";
    return allowedIPs.includes(ip);
  };