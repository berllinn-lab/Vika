import { NextResponse } from 'next/server';
import { deleteInquiry, markInquirySeen } from '@/lib/db';
import { isAdmin } from '@/lib/auth';

export async function PATCH(_req, { params }) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  markInquirySeen(Number(params.id));
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req, { params }) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  deleteInquiry(Number(params.id));
  return NextResponse.json({ ok: true });
}
