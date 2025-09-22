import { NextResponse } from 'next/server';
import { Business, BuinessUsers } from '@/models/associationt.ts/association';

type CrudOperation = 'create' | 'read' | 'update' | 'delete';

interface AuthorizationSuccess {
  ok: true;
  userId: number;
  businessId: number;
  role: 'member' | 'manager' | 'admin' ;
  business: { id: number };
  buinessUserId: number;
  operations: CrudOperation[];
}

interface AuthorizationFailure {
  ok: false;
  response: NextResponse;
}

type AuthorizationResult = AuthorizationSuccess | AuthorizationFailure;

 function isOperationAllowed(role: 'member' | 'manager' | 'admin' , op: CrudOperation): boolean {
  if ( role === 'admin') return true; // full access
  if (role === 'manager') {
    return op === 'create' || op === 'read' || op === 'update';
  }
  // member
  return op === 'read';
}

 function getAllowedOperations(role: 'member' | 'manager' | 'admin'): CrudOperation[] {
  if (role === 'admin') return ['create', 'read', 'update', 'delete'];
  if (role === 'manager') return ['create', 'read', 'update'];
  return ['read'];
 }

export async function authorizeBusinessAccess(userId: number, businessIdInput: unknown, operation: CrudOperation): Promise<AuthorizationResult> {
  // Validate businessId
  const businessId = Number(businessIdInput);
  if (!businessId || Number.isNaN(businessId) || businessId <= 0) {
    return { ok: false, response: NextResponse.json({ error: 'businessId is required' }, { status: 400 }) };
  }

  // Locate business
  const business = await Business().findOne({ where: { id: businessId } });
  if (!business) {
    return { ok: false, response: NextResponse.json({ error: 'Business not found' }, { status: 404 }) };
  }

  // Check membership (true source of role)
  const link = await BuinessUsers().findOne({ where: { userId, businessId } });
  if (!link) {
    return { ok: false, response: NextResponse.json({ error: 'Forbidden: not a member of this business' }, { status: 403 }) };
  }

  const status = link.get('status');
  if (status !== 'active') {
    return { ok: false, response: NextResponse.json({ error: `Access denied: status ${status}` }, { status: 403 }) };
  }

  const role = link.get('role') as 'member' | 'manager' | 'admin';
  if (!isOperationAllowed(role, operation)) {
    return { ok: false, response: NextResponse.json({ error: 'Forbidden: insufficient role' }, { status: 403 }) };
  }

  return { 
    ok: true, 
    userId, 
    businessId, 
    role, 
    business: { id: businessId }, 
    buinessUserId: link.get('id') as number, 
    operations: getAllowedOperations(role) 
  };
}


