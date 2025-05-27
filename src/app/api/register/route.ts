// src/app/api/register/route.ts

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password } = body

    console.log('➡️ Requête reçue pour inscription :', body)

    // Validation simple
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis.' },
        { status: 400 }
      )
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.otherUser.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email déjà utilisé.' },
        { status: 400 }
      )
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10)

    // Sauvegarde dans la base de données
    const newUser = await prisma.otherUser.create({
      data: {
        email,
        password: hashedPassword,
      },
    })

    console.log('✅ Utilisateur créé :', newUser)

    return NextResponse.json(
      { success: true, userId: newUser.id },
      { status: 201 }
    )
  } catch (error) {
    console.error('💥 Erreur lors de l\'inscription :', error)
    return NextResponse.json(
      { error: 'Erreur serveur. Veuillez réessayer.' },
      { status: 500 }
    )
  }
}



// import { NextResponse } from 'next/server';
// import { prisma } from '@/lib/prisma';
// import bcrypt from 'bcryptjs';

// export async function POST(req: Request) {
//   try {
//     console.log('➡️ Requête POST /api/register reçue');
//     const { email, password } = await req.json();
//     console.log('📨 Données reçues :', { email, password });

//     if (!email || !password) {
//       console.warn('⚠️ Email ou mot de passe manquant');
//       return NextResponse.json({ error: 'Email et mot de passe requis' }, { status: 400 });
//     }

//     const existingUser = await prisma.user.findUnique({ where: { email } });
//     if (existingUser) {
//       console.warn('⚠️ Email déjà utilisé');
//       return NextResponse.json({ error: 'Email déjà utilisé' }, { status: 400 });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     console.log('🔐 Mot de passe hashé :', hashedPassword);

//     const userData = {
//       email,
//       password: hashedPassword
//     };

//     console.log('📝 Données à insérer :', userData);

//     const newUser = await prisma.user.create({
//       data: userData,
//     });

//     console.log('✅ Utilisateur créé avec succès, ID :', newUser.id);
//     return NextResponse.json({ success: true, userId: newUser.id }, { status: 201 });
    
//   } catch (err) {
//     console.error('💥 Erreur dans /api/register :', err);
    
//     // Gestion spécifique des erreurs Prisma
//     if (err instanceof Error) {
//       if (err.message.includes('P2002')) {
//         return NextResponse.json({ error: 'Email déjà utilisé' }, { status: 400 });
//       }
//       if (err.message.includes('P2011')) {
//         console.error('💥 Contrainte NULL violée. Vérifiez les champs obligatoires.');
//         return NextResponse.json({ error: 'Données invalides' }, { status: 400 });
//       }
//     }
    
//     return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
//   }
// }