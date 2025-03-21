# Adiciona suporte para salvar e carregar progresso em arquivo JSON local

## Descrição
Este PR adiciona a funcionalidade de salvar e carregar o progresso em um arquivo JSON local no servidor, permitindo a sincronização entre dispositivos.

## Alterações
- Adicionado mecanismo para salvar o progresso em um arquivo JSON físico
- Criado script PHP para salvar o progresso no servidor
- Implementado fallback para armazenamento local em caso de falha no servidor
- Adicionada interface de importação/exportação
- Adicionados estilos para os novos componentes

## Por que esta mudança é necessária?
Até agora, o progresso era salvo apenas no localStorage do navegador, o que impedia a sincronização entre diferentes dispositivos. Com esta mudança, os dados são armazenados em um arquivo JSON físico no servidor, permitindo acesso de qualquer dispositivo.

## Como testar?
1. Abra o aplicativo
2. Marque alguns checkboxes nas unidades
3. Verifique que o arquivo progress.json foi criado na raiz do projeto
4. Abra o aplicativo em outro dispositivo
5. Verifique se os checkboxes estão sincronizados
6. Se quiser transferir manualmente o progresso, use os botões de exportar/importar

## Requisitos
- Servidor com suporte a PHP para processar as requisições de salvamento
- Permissões de escrita na pasta raiz do projeto para criar o arquivo JSON

## Implementação Técnica
- O progresso é salvo em um arquivo JSON físico no servidor via requisição AJAX
- Script PHP save_progress.php para processar as requisições
- Fallback para localStorage em caso de falha na conexão com o servidor
- Opções manuais de exportação/importação mantidas 