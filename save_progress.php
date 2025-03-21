<?php
// Definindo cabeçalhos para retornar JSON e permitir CORS se necessário
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Nome do arquivo onde será salvo o progresso
$file = 'progress.json';

// Verificar se é uma requisição POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Pegar os dados JSON enviados
        $json_data = file_get_contents('php://input');
        
        // Verificar se os dados são um JSON válido
        $decoded = json_decode($json_data);
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception('Dados JSON inválidos');
        }
        
        // Salvar os dados no arquivo
        $result = file_put_contents($file, $json_data);
        
        if ($result === false) {
            throw new Exception('Erro ao salvar o arquivo');
        }
        
        // Retornar sucesso
        echo json_encode([
            'success' => true,
            'message' => 'Progresso salvo com sucesso',
            'timestamp' => date('Y-m-d H:i:s')
        ]);
    } catch (Exception $e) {
        // Retornar erro
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
} else {
    // Se não for uma requisição POST
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Método não permitido. Use POST.'
    ]);
} 