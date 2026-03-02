import { useLocation, useNavigate } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';
import './OrderSuccessPage.css';

interface OrderState {
    totalItems: number;
    totalPrice: number;
}

function OrderSuccessPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as OrderState | null;

    const formatPrice = (value: number): string => {
        return value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        });
    };

    return (
        <div className="order-success-page">
            <div className="order-success-container">
                <div className="success-icon">
                    <FiCheckCircle />
                </div>

                <h1>Pedido Enviado com Sucesso!</h1>
                <p className="success-subtitle">
                    Seu pedido foi enviado para o SAP Ariba e está sendo processado.
                </p>

                {state && (
                    <div className="order-summary">
                        <h2>Resumo do Pedido</h2>
                        <div className="summary-row">
                            <span>Itens</span>
                            <span>{state.totalItems}</span>
                        </div>
                        <div className="summary-row total">
                            <span>Total</span>
                            <span>{formatPrice(state.totalPrice)}</span>
                        </div>
                    </div>
                )}

                <button
                    className="back-catalog-btn"
                    onClick={() => navigate('/')}
                >
                    Voltar ao Catálogo
                </button>
            </div>
        </div>
    );
}

export default OrderSuccessPage;
