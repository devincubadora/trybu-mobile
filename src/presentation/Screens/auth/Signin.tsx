import { Center, HStack, Pressable, Text } from 'native-base'

import { Button } from '../../components/Button'
import { Input } from '../../components/Input'
import { LogoLG } from '../../components/Logo'
import { useAuth } from '../../../hooks/useAuth'
import { useAuthPage } from '../../../hooks/useAuthPage'


export function Signin () {
  const { setPage } = useAuthPage()
  const { signIn, userIsLoading, formDataSignin, setFormDataSignin } = useAuth()

  const handleChangeInput = (name: string, text: string) => {
    setFormDataSignin({ ...formDataSignin, [name]: text })
  }


  return (
    <Center flex={1} p={5} alignItems="center">
      <LogoLG />
      <Text
        color="white"
        textAlign="center"
        fontSize={'2xl'}
        my={4}
      >
        Iniciar sessão
      </Text>

      <Input
        type='text'
        placeholder='E-mail ou telefone'
        onChangeText={
          (text: string) => {
            handleChangeInput('email', text)
          }
        }
        value={formDataSignin.email || ''}
      />
      <Input
        type='password'
        placeholder='Palavra passe'
        onChangeText={
          (text: string) => {
            handleChangeInput('password', text)
          }
        }
        value={formDataSignin.password || ''}
        mt={'5'}
      />
      <Pressable>
        <Text color={'white'} textTransform='uppercase' mt={2}>
          Recuperar a palavra passe
        </Text>
      </Pressable>

      <HStack space={2} alignItems='center'>
        <Text color={'white'} textTransform='uppercase' mt={2}>
          Ainda não possui uma conta?
        </Text>
        <Pressable onPress={() => {
          setPage('signup')
        }}>
          <Text color={'red.200'}>Regista-te</Text>
        </Pressable>
      </HStack>
      <Button
        title='ENTRAR'
        mt={5}
        onPress={signIn}
        isLoading={userIsLoading}
        _loading={{ _spinner: { color: 'white' } }}
      />
    </Center>
  )
}