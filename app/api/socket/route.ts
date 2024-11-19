import { Server } from 'socket.io';
import { NextApiRequest } from 'next';
import { NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const ioHandler = (req: NextApiRequest, res: NextApiResponse) => {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on('connection', async (socket) => {
      const userId = socket.handshake.auth.userId;
      
      // Join user's room for private messages
      socket.join(userId);

      // Update user status
      await prisma.user.update({
        where: { id: userId },
        data: { isOnline: true },
      });

      // Handle study buddy features
      socket.on('message', async (data) => {
        io.to(data.to).emit('message', {
          from: userId,
          content: data.content,
        });
      });

      socket.on('studyInvite', async (data) => {
        io.to(data.to).emit('studyInvite', {
          from: userId,
        });
      });

      // Handle collaborative notes
      socket.on('saveNote', async (note) => {
        const updatedNote = await prisma.note.update({
          where: { id: note.id },
          data: {
            content: note.content,
            lastUpdated: new Date(),
          },
        });

        // Notify all collaborators
        note.collaborators.forEach((collaboratorId: string) => {
          io.to(collaboratorId).emit('noteUpdate', updatedNote);
        });
      });

      socket.on('shareNote', async (data) => {
        const note = await prisma.note.findUnique({
          where: { id: data.noteId },
          include: { collaborators: true },
        });

        if (note) {
          io.to(data.userId).emit('noteShared', note);
        }
      });

      // Handle progress updates
      socket.on('progressUpdate', async (data) => {
        // Broadcast to admin dashboard
        io.to('admin').emit('userProgress', {
          userId,
          ...data,
        });

        // Notify friends/study buddies
        const user = await prisma.user.findUnique({
          where: { id: userId },
          include: { friends: true },
        });

        if (user) {
          user.friends.forEach(friend => {
            io.to(friend.id).emit('friendProgress', {
              userId,
              userName: user.name,
              ...data,
            });
          });
        }
      });

      socket.on('disconnect', async () => {
        // Update user status
        await prisma.user.update({
          where: { id: userId },
          data: { isOnline: false },
        });
      });
    });
  }

  res.end();
};

export const GET = ioHandler;
export const POST = ioHandler;