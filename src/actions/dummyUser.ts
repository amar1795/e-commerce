// pages/api/createDummyUsers.js
import { faker } from '@faker-js/faker';
import { prismadb } from "@/lib/db";
import { NextResponse } from 'next/server';

export  async function dummyUserFunction() { 
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
        
          } catch (error) {
            console.error('Error creating dummy users:', error);}
      }
  
      export async function getUserBySpecificEmail(email: string) {
        try {
          const user = await prismadb.user.findUnique({
            where: {
              email: email,
            },
          });
          console.log("this is the user", user);
          return user;
        } catch (error) {
          console.error('Error fetching user by email:', error);
          throw error;
        }
      }

      