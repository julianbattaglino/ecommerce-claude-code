import { createSupabaseAdminClient } from '@/lib/supabase/server'

export interface OrderItem {
  productId: string
  title: string
  quantity: number
  price: number
}

export interface OrderData {
  userId: string
  items: OrderItem[]
  total: number
  paymentMethod: 'mercadopago' | 'transfer'
  customerName: string
  customerEmail: string
  customerPhone: string
  deliveryAddress: string
  deliveryCity: string
  deliveryZipCode: string
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'completed'
  paymentId?: string
}

export async function createOrder(data: OrderData) {
  const supabase = createSupabaseAdminClient()

  try {
    console.log('[LIB/ORDERS] Iniciando createOrder con datos:', {
      userId: data.userId,
      itemsCount: data.items.length,
      total: data.total,
    })

    const orderData: any = {
      user_id: data.userId,
      items: data.items,
      total: data.total,
      payment_method: data.paymentMethod,
      customer_name: data.customerName,
      customer_email: data.customerEmail,
      customer_phone: data.customerPhone,
      delivery_address: data.deliveryAddress,
      delivery_city: data.deliveryCity,
      delivery_zip_code: data.deliveryZipCode,
      status: data.status,
    }

    if (data.paymentId) {
      orderData.payment_id = data.paymentId
    }

    console.log('[LIB/ORDERS] Insertando en tabla orders:', orderData)

    const { data: newOrder, error } = await supabase
      .from('orders')
      .insert([orderData])
      .select()
      .single()

    if (error) {
      console.error('[LIB/ORDERS] Error de Supabase:', error)
      return { success: false, error: `Supabase: ${error.message}` }
    }

    console.log('[LIB/ORDERS] Orden creada exitosamente:', newOrder.id)
    return { success: true, data: newOrder }
  } catch (error) {
    console.error('[LIB/ORDERS] Excepción:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function getOrderById(orderId: string) {
  const supabase = createSupabaseAdminClient()

  try {
    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()

    if (error) {
      console.error('Error fetching order:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data: order }
  } catch (error) {
    console.error('Error in getOrderById:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function getUserOrders(userId: string) {
  const supabase = createSupabaseAdminClient()

  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching user orders:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data: orders }
  } catch (error) {
    console.error('Error in getUserOrders:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function updateOrderStatus(orderId: string, status: string, paymentId?: string) {
  const supabase = createSupabaseAdminClient()

  try {
    const updateData: any = { status }
    if (paymentId) updateData.payment_id = paymentId

    const { data: updatedOrder, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId)
      .select()
      .single()

    if (error) {
      console.error('Error updating order:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data: updatedOrder }
  } catch (error) {
    console.error('Error in updateOrderStatus:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function getOrdersCount() {
  const supabase = createSupabaseAdminClient()

  try {
    const { count, error } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })

    if (error) {
      console.error('Error counting orders:', error)
      return 0
    }

    return count || 0
  } catch (error) {
    console.error('Error in getOrdersCount:', error)
    return 0
  }
}
