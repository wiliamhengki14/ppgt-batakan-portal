interface IUser {
    id: number;
    name: string;
    email: string;
    phone_number: string;
    role: string;
    profile_photo_path?: string | null;
    profile_photo_url?: string | null;
    duty_count?: number;
    is_eligible_for_duty?: boolean;
    last_duty_at?: string;
}
interface PpgtProfile {
    user_id: number;
    user: IUser;
    residence_type: 'lokal_batakan' | 'perantau';
    gender: 'L' | 'P';
    birth_date: string;
    sector_in_batakan: string;
    batakan_home_address: string;
    parent_names: string;
    talents?: string[] | null;
    overseas_city?: string | null;
    overseas_address?: string | null;
    overseas_purpose?: 'pendidikan' | 'kerja' | 'lainnya' | null;
    church_at_overseas?: string | null;
    return_plan?: string | null;
    verification_status: 'pending' | 'approved' | 'rejected';
    rejection_note?: string | null;
}

export type {IUser, PpgtProfile};