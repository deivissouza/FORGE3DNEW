export interface PricingSettings {
    plaPricePerGram: number;
    petgPricePerGram: number;
    profitMargin: number;
    machineCostPerHour: number;
    minimumOrder: number;
}

export interface QuoteCalculation {
    materialCost: number;
    timeCost: number;
    subtotal: number;
    profitMargin: number;
    total: number;
    estimatedHours: number;
}

export function calculateQuote(
    weight: number,
    material: 'PLA' | 'PETG',
    settings: PricingSettings
): QuoteCalculation {
    // Material cost
    const pricePerGram = material === 'PLA'
        ? settings.plaPricePerGram
        : settings.petgPricePerGram;

    const materialCost = weight * pricePerGram;

    // Time estimation (rough: 1g = 0.1 hour)
    const estimatedHours = weight * 0.1;
    const timeCost = estimatedHours * settings.machineCostPerHour;

    // Subtotal
    const subtotal = materialCost + timeCost;

    // Apply profit margin
    const profitAmount = subtotal * (settings.profitMargin / 100);
    let total = subtotal + profitAmount;

    // Apply minimum order
    if (total < settings.minimumOrder) {
        total = settings.minimumOrder;
    }

    return {
        materialCost,
        timeCost,
        subtotal,
        profitMargin: profitAmount,
        total,
        estimatedHours,
    };
}

export function formatWhatsAppMessage(
    customerName: string,
    modelName: string,
    material: string,
    color: string,
    weight: number,
    price: number,
    modelLink?: string
): string {
    const message = `Olá! Meu nome é ${customerName}.

Gostaria de solicitar um orçamento para impressão 3D:

📦 *Modelo:* ${modelName}
${modelLink ? `🔗 *Link:* ${modelLink}` : ''}
🎨 *Material:* ${material}
🌈 *Cor:* ${color}
⚖️ *Peso:* ${weight}g
💰 *Valor:* R$ ${price.toFixed(2)}

⏱️ *Entrega:* A combinar

Aguardo retorno!`;

    return encodeURIComponent(message);
}
