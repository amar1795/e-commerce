import { prismadb } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

// instead of this directly create  the server action file and run in the server rendered file it will created just checke in the about us page
export  async function GET(req: Request, res: Response) { 
        try {
            const posters = await prismadb.poster.findMany({
                select: {
                    label: true,
                    imageUrl: true
                }
            });     
            return NextResponse.json({ message: 'Here is the posters', users: posters }, { status: 200 });
          } catch (error) {
            console.error('Error creating dummy users:', error);
            return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
          }
      }
  
