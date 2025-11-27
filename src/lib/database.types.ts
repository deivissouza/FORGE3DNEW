export interface Database {
    public: {
        Tables: {
            materials: {
                Row: {
                    id: string;
                    name: string;
                    description: string;
                    price_per_gram: number;
                    created_at: string;
                };
                Insert: {
                    id: string;
                    name: string;
                    description: string;
                    price_per_gram: number;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    name?: string;
                    description?: string;
                    price_per_gram?: number;
                    created_at?: string;
                };
            };
            popular_models: {
                Row: {
                    id: string;
                    name: string;
                    creator: string;
                    image_url: string;
                    source: 'Printables' | 'Thingiverse' | 'MakerWorld' | 'Outros';
                    tag: string;
                    link: string;
                    description: string | null;
                    created_at: string;
                };
                Insert: {
                    id: string;
                    name: string;
                    creator: string;
                    image_url: string;
                    source: 'Printables' | 'Thingiverse' | 'MakerWorld' | 'Outros';
                    tag: string;
                    link: string;
                    description?: string | null;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    name?: string;
                    creator?: string;
                    image_url?: string;
                    source?: 'Printables' | 'Thingiverse' | 'MakerWorld' | 'Outros';
                    tag?: string;
                    link?: string;
                    description?: string | null;
                    created_at?: string;
                };
            };
            site_config: {
                Row: {
                    key: string;
                    value: any;
                    updated_at: string;
                };
                Insert: {
                    key: string;
                    value: any;
                    updated_at?: string;
                };
                Update: {
                    key?: string;
                    value?: any;
                    updated_at?: string;
                };
            };
        };
    };
}
