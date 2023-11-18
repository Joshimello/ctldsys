import { redirect, fail } from '@sveltejs/kit';

export const load = async ({ locals, params }) => {
  let response, records
  try {
    response = await locals.pb.collection(params.slug).getOne(params.resp, {
      expand: 'status,responder'
    })
    records = await locals.pb.collection(params.slug).getFullList({
      expand: 'status',
      fields: 'id,serial,expand.status,0'
    })
  }
  catch (err) {
    throw redirect(302, '/admin')
  }
  return { response, records }
}

export const actions = {
  approve: async ({ locals, request, params }) => {
    try {
      const record = await locals.pb.collection(params.slug).update(params.resp, {
        status: 'approved_____st'
      });
      return fail(400, { success: true });
    }
    catch (err) {
      return fail(400, { success: false });
    }
  },
  reject: async ({ locals, request, params }) => {
    try {
      const record = await locals.pb.collection(params.slug).update(params.resp, {
        status: 'rejected_____st'
      });
      return fail(400, { success: true });
    }
    catch (err) {
      return fail(400, { success: false });
    }
  },
  review: async ({ locals, request, params }) => {
    const data = await request.formData();
    const fields = data.get('fields')
    
    try {
      const record = await locals.pb.collection(params.slug).update(params.resp, {
        status: 'review_______st',
        statusinfo: {
          fields: JSON.parse(fields)
        }
      });
      return fail(400, { success: true });
    }
    catch (err) {
      return fail(400, { success: false });
    }
  }
}