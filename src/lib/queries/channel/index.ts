/**
 * Channel Queries - Index
 * Exporta todas as queries relacionadas a canais
 */

// Fetch operations
export {
  fetchChannelsByTenant,
  fetchChannelById,
  fetchChannelProviders,
  checkIdentificationNumberExists,
  type ChannelWithProvider
} from './channel-fetch.queries'

// CRUD operations
export {
  createChannel,
  updateChannel,
  deleteChannel,
  toggleChannelActiveStatus,
  toggleChannelReceivingMessages,
  toggleChannelSendingMessages
} from './channel-crud.queries'
