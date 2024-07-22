// pages/api/createDummyUsers.js
import { faker } from '@faker-js/faker';
import { prismadb } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

// instead of this directly create  the server action file and run in the server rendered file it will created just checke in the about us page
export  async function POST(req: Request, res: Response) { 
        try {
            // Create 10 dummy users
            const dummyUsers = [];
            for (let i = 0; i < 10; i++) {
              const name = faker.person.fullName();
              const email = faker.internet.email();
              const password = faker.internet.password();
        
              const user = await prismadb.user.create({
                data: {
                  name: name,
                  email: email,
                  emailVerified: faker.date.past(), // Simulating past date for email verification
                  image: faker.image.avatar(),
                  password: password,
                  role: 'USER',
                  isTwoFactorEnabled: false,
                  
                  // You may add more fields if required
                },
              });
              dummyUsers.push(user);
            }
        
            return NextResponse.json({ message: 'Dummy users created successfully', users: dummyUsers }, { status: 200 });
          } catch (error) {
            console.error('Error creating dummy users:', error);
            return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
          }
      }
  
