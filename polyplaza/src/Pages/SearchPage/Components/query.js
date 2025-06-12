// query.ts
import { supabase } from "../../../supabase";

export const getCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('product')
      .select('category')
      .not('category', 'is', null)
      .order('category', { ascending: true })
      .limit(1000);

    if (error) {
      throw error;
    }

    if (!data) {
      return [];
    }

    // Type assertion and null check
    return [...new Set(data.map(item => item.category).filter(Boolean))];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};