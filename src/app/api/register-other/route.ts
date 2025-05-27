import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    console.log('➡️ Requête POST /api/register-other reçue');
    const { email, password } = await req.json();
    console.log('📨 Données reçues :', { email, password });

    if (!email || !password) {
      return NextResponse.json({ error: 'Email et mot de passe requis' }, { status: 400 });
    }

    const existingUser = await prisma.otherUser.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'Email déjà utilisé' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.otherUser.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    console.log('✅ Utilisateur OtherUser créé avec succès, ID :', newUser.id);
    return NextResponse.json({ success: true, userId: newUser.id }, { status: 201 });

  } catch (err: any) {
    console.error('💥 Erreur dans /api/register-other :', err);

    if (err.code === 'P2002') {
      return NextResponse.json({ error: 'Email déjà utilisé' }, { status: 400 });
    }

    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
