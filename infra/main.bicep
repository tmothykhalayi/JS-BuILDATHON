// Main infrastructure file for the AI Chat Interface
targetScope = 'resourceGroup'

// ====================
// PARAMETERS
// ====================

param environmentName string = 'dev'
param location string = resourceGroup().location
param resourceToken string = toLower(uniqueString(subscription().id, resourceGroup().id, location))

// Derived names for Azure resources
param webappName string = 'webapp-${resourceToken}'
param webapiName string = 'webapi-${resourceToken}'
param appServicePlanName string = 'asp-${resourceToken}'

// ====================
// VARIABLES
// ====================

var tags = {
  'azd-env-name': environmentName
  project: 'ai-chat-interface'
}

// ====================
// RESOURCES
// ====================

// App Service Plan for the webapi
resource serverfarm 'Microsoft.Web/serverfarms@2024-04-01' = {
  name: appServicePlanName
  location: location
  tags: tags
  sku: {
    name: 'B1'
    tier: 'Basic'
  }
  properties: {
    reserved: false
  }
}

// App Service for the webapi
resource webapi 'Microsoft.Web/sites@2024-04-01' = {
  name: webapiName
  location: location
  tags: union(tags, { 'azd-service-name': 'webapi' })
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: serverfarm.id
    httpsOnly: true
    siteConfig: {
      ftpsState: 'Disabled'
      minTlsVersion: '1.2'
      nodeVersion: '18-lts'
      appSettings: [
        {
          name: 'AZURE_INFERENCE_SDK_ENDPOINT'
          value: 'https://gpt-4o-mini-uc7m.eastus2.models.ai.azure.com'
        }
        {
          name: 'AZURE_INFERENCE_SDK_KEY'
          value: 'BPjfh3MAvYKrEnidzbDbNMrhDxfc0rcWORkTWTBQFyi94QQKYDkOJQQJ99BFACfhMk5XJ3w3AAAAACOGXy2p'
        }
      ]
      cors: {
        allowedOrigins: ['*']
        supportCredentials: false
      }
    }
  }
}

// Static Web App for the frontend
resource webapp 'Microsoft.Web/staticSites@2024-04-01' = {
  name: webappName
  location: location
  tags: union(tags, { 'azd-service-name': 'webapp' })
  sku: {
    name: 'Standard'
    tier: 'Standard'
  }
  properties: {
    buildProperties: {
      appLocation: '/'
      apiLocation: ''
      outputLocation: 'dist'
    }
  }
}

// ====================
// OUTPUTS
// ====================

output WEBAPP_URL string = 'https://${webapp.properties.defaultHostname}'
output WEBAPI_URL string = 'https://${webapi.properties.defaultHostName}'
output RESOURCE_GROUP_NAME string = resourceGroup().name
