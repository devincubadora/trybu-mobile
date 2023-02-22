import { useCallback, useState } from 'react'
import { Box, HStack, Pressable, Text, VStack } from "native-base"
import { useFocusEffect, useNavigation } from '@react-navigation/native'

import { Event } from "../../components/Event"
import { Layout, LayoutBody, LayoutHeader } from "../../components/Layout"
import { TextTitle } from "../../components/TextTitle"
import { IEvent } from '../../../@types/event'
import { makeAxiosHttpClient } from '../../../main/factory/axios-http-client-factory'
import { Loading } from '../../components/Loading'
import { HttpStatusCode } from '../../../data/protocol/http'
import { Alert } from 'react-native'
import { useAuth } from '../../../hooks/useAuth'
import { SearchBar } from '../../components/SearchBar'
import { PlusCircle } from 'phosphor-react-native'

export function Events () {
  const { navigate } = useNavigation()
  const { signOut } = useAuth()

  const [isLoading, setIsLoading] = useState<boolean>(true)

  const [events, setEvents] = useState<IEvent[]>([])
  const [filteredEvents, setFilteredEvents] = useState<IEvent[]>([])

  useFocusEffect(useCallback(() => {
    fetchEvents()
  }, []))

  async function fetchEvents () {
    setIsLoading(true)
    const { statusCode, body } = await makeAxiosHttpClient().get({ url: '/events' })

    if (statusCode === HttpStatusCode.unauthorized) {
      Alert.alert('Sessão expirada', 'A sua sessão expirou, inicie novamente para continuar.')
      signOut()
    } else {
      setEvents(body.events)
      setFilteredEvents(body.events)
    }
    setIsLoading(false)
  }

  const filterEvents = (text: string) => {
    const typedText = text.trim()
    console.log('typedText', typedText)

    if (typedText) {
      const filterdEvents = events.filter(event => {
        return event.title.toLowerCase().includes(typedText.toLowerCase())
      })
      console.log('filterdEvents', filterdEvents.map(e => e.title))

      setFilteredEvents(filterdEvents)
      return
    }

    setFilteredEvents(events)
  }

  return (
    <Layout>
      <LayoutHeader>
        <SearchBar onChangeText={filterEvents} />
        <HStack
          alignItems='center'
        >
          <TextTitle title='Eventos' />
          <Text ml={1}>{isLoading ? '' : `(${events.length})`}</Text>
          <Pressable
            flexDir='row'
            ml='auto'
            bg='yellow.400'
            px={3}
            py={1}
            borderRadius={'full'}
            _pressed={{
              bg: 'yellow.500'
            }}
            shadow={1}
            onPress={() => navigate('newevent')}
          >
            <Text fontFamily='medium' mr={1}>Novo</Text>
            <PlusCircle />
          </Pressable>
        </HStack>
      </LayoutHeader>

      <LayoutBody>
        <HStack
          p={5}
          bg={'gray.100'}
          shadow={2}
        >
          <Text
            flex={1}
            textAlign={'center'}
            fontSize={20}
          >
            Calendário de eventos
          </Text>
        </HStack>

        {isLoading ? <Loading text='Carregando eventos' />
          :
          <VStack mt={5} space={5}>
            {filteredEvents.length < 1 ?
              <Box alignItems={'center'}>
                <Text>Nenhum evento de momento.</Text>
              </Box>
              :
              events.map((event) => (
                <Event key={event.id} event={event} />
              ))
            }
          </VStack>
        }
      </LayoutBody>
    </Layout>
  )
}