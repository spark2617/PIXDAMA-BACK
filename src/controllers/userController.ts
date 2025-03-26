import { Request, Response } from 'express';
import { supabase } from '../utils/supabase';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Make sure to add JWT_SECRET to your .env file
if (!process.env.JWT_SECRET || !process.env.JWT_EXPIRES_IN) {
    throw new Error('JWT_SECRET is not defined in environment variables');
}

const JWT_SECRET: string = process.env.JWT_SECRET;
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN;

export const userController = {
    async signUp(req: Request, res: Response): Promise<any> {
        try {
            const { name, email, password, cpf, birthdate } = req.body;

            // Check if user already exists
            const { data: existingUser } = await supabase
                .from('users')
                .select('*')
                .eq('email', email)
                .single();

            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'User already exists'
                });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert new user
            const { data, error } = await supabase
                .from('users')
                .insert([
                    {
                        name,
                        email,
                        password: hashedPassword,
                        cpf: cpf,
                        birthdate: birthdate
                    }
                ])
                .select()
                .single();

            if (error) throw error;

            // Remove password from response
            const { password: _, ...userWithoutPassword } = data;

            return res.status(201).json({
                success: true,
                message: 'Registration successful',
                data: userWithoutPassword
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    async signIn(req: Request, res: Response): Promise<any> {
        try {
            const { email, password } = req.body;

            // Get user by email
            const { data: user, error } = await supabase
                .from('users')
                .select('*')
                .eq('email', email)
                .single();

            if (error || !user) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            // Verify password
            const isValidPassword = await bcrypt.compare(password, user.password);

            if (!isValidPassword) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            // Generate JWT token
            const token = jwt.sign(
                { 
                    userId: user.id,
                    email: user.email,
                    cpf: user.cpf
                },
                JWT_SECRET,
                { expiresIn: JWT_EXPIRES_IN as any }
            );

            // Remove password from response
            const { password: _, ...userWithoutPassword } = user;

            // Set cookie
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
                sameSite: 'strict',
                maxAge: 24 * 60 * 60 * 1000 // 24 hours
            });

            return res.status(200).json({
                success: true,
                message: 'Login successful',
                data: {
                    user: userWithoutPassword
                }
            });
        } catch (error: any) {
            return res.status(401).json({
                success: false,
                message: error.message
            });
        }
    },

    async signOut(req: Request, res: Response): Promise<any> {
        try {
            res.cookie('token', '', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                expires: new Date(0), // Set expiration to past date
                path: '/'
            });

            return res.status(200).json({
                success: true,
                message: 'Logout successful'
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    async getSession(req: Request, res: Response): Promise<any> {
        try {
            // req.user is available from the auth middleware
            const { userId } = req.user!;

            // Fetch user data from database
            const { data: userData, error } = await supabase
                .from('users')
                .select('name, email, profile, totalWins, birthdate')
                .eq('id', userId)
                .single();

            if (error) throw error;

            return res.status(200).json({
                success: true,
                data: {
                    id: userId,
                    nome: userData.name,
                    email: userData.email,
                    administrador: userData.profile === "admin",
                    totalVitorias: userData.totalWins,
                    usuarioAutenticado: true
                }
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: 'Error fetching user session',
                error: error.message
            });
        }
    }
};