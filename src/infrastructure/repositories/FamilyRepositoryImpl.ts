import type { Familia, Grupo, Subgrupo } from "../../domain/entities/Product";

export interface FamiliesResponse extends Familia{
    groups: {
        codigo: number
        descricao: string,
        subgroups: Subgrupo[]
    }[]
}

export class FamilyRepositoryImpl{
    private baseUrl: string;
    private sessionId: string;

    constructor(sessionId: string, baseUrl: string = 'http://localhost:3000') {
        this.sessionId = sessionId;
        this.baseUrl = baseUrl;
    }

    async getAllFamilies(): Promise<FamiliesResponse[]>{
        let url = `${this.baseUrl}/familias?session=${this.sessionId}`;

        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            const result: FamiliesResponse[] = data.map((f: any) => {
                return {
                    ...f,
                    groups: f.grupos.map((g: any) => ({...g, subgroups: g.subgrupos}))
                }
            })

            return result
        } catch (error) {
            console.error('Error fetching catalog products:', error);
            throw error;
        }
    }
}