import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest'
import {
  emailPasswordNetworkErrorHandler,
  incorrectEmailPasswordHandler,
  passwordlessEmailPasswordNetworkErrorHandler
} from './helpers/signInHandlers'
import { AuthContext, AuthEvents, createAuthMachine } from '../src/machines'
import { BaseActionObject, interpret, ResolveTypegenMeta, ServiceMap, State } from 'xstate'
import { Typegen0 } from '../src/machines/index.typegen'
import faker from '@faker-js/faker'
import { waitFor } from 'xstate/lib/waitFor'
import server from './helpers/server'
import customStorage from './helpers/storage'
import { authTokenNetworkErrorHandler } from './helpers/generalHandlers'

type AuthState = State<
  AuthContext,
  AuthEvents,
  any,
  {
    value: any
    context: AuthContext
  },
  ResolveTypegenMeta<Typegen0, AuthEvents, BaseActionObject, ServiceMap>
>

// Initialzing AuthMachine with custom storage to have control over its content between tests
const authMachine = createAuthMachine({
  backendUrl: 'http://localhost:1337/v1/auth',
  clientUrl: 'http://localhost:3000',
  clientStorage: customStorage,
  clientStorageType: 'custom'
})

const authService = interpret(authMachine)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())

beforeEach(() => {
  authService.start()
})

afterEach(() => {
  authService.stop()
  customStorage.clear()
  server.resetHandlers()
})

describe('Sign in with email and password', () => {
  test(`should reach an error state if network is unavailable`, async () => {
    server.use(emailPasswordNetworkErrorHandler, authTokenNetworkErrorHandler)

    authService.send({
      type: 'SIGNIN_PASSWORD',
      email: faker.internet.email(),
      password: faker.internet.password(15)
    })

    const state: AuthState = await waitFor(authService, (state: AuthState) =>
      state.matches({ authentication: { signedOut: { failed: 'server' } } })
    )

    expect(state.context.errors).toMatchInlineSnapshot(`
    {
      "authentication": {
        "error": "OK",
        "message": "Network Error",
        "status": 200,
      },
    }
    `)
  })

  test(`should fail if either the provided email address or provided password was invalid`, async () => {
    // Scenario 1: Providing an invalid email address with a valid password
    authService.send({
      type: 'SIGNIN_PASSWORD',
      email: faker.internet.userName(),
      password: faker.internet.password(15)
    })

    const emailErrorSignInState: AuthState = await waitFor(
      authService,
      (state: AuthState) => !!state.value
    )

    expect(
      emailErrorSignInState.matches({
        authentication: { signedOut: { failed: { validation: 'email' } } }
      })
    ).toBeTruthy()

    // Scenario 2: Providing a valid email address with an invalid password
    authService.send({
      type: 'SIGNIN_PASSWORD',
      email: faker.internet.email('john', 'doe'),
      password: faker.internet.password(2)
    })

    const passwordErrorSignInState: AuthState = await waitFor(
      authService,
      (state: AuthState) => !!state.value
    )

    expect(
      passwordErrorSignInState.matches({
        authentication: { signedOut: { failed: { validation: 'password' } } }
      })
    ).toBeTruthy()
  })

  test(`should fail if incorrect credentials were provided`, async () => {
    server.use(incorrectEmailPasswordHandler)

    const email = faker.internet.email('john', 'doe')
    const password = faker.internet.password(15)

    authService.send({
      type: 'SIGNIN_PASSWORD',
      email,
      password
    })

    const signInState: AuthState = await waitFor(authService, (state: AuthState) =>
      state.matches({ authentication: { signedOut: { failed: 'server' } } })
    )

    expect(signInState.context.errors).toMatchInlineSnapshot(`
            {
              "authentication": {
                "error": "invalid-email-password",
                "message": "Incorrect email or password",
                "status": 401,
              },
            }
            `)
  })

  test(`should succeed if correct credentials were provided`, async () => {
    const email = faker.internet.email('john', 'doe')
    const password = faker.internet.password(15)

    authService.send({
      type: 'SIGNIN_PASSWORD',
      email,
      password
    })

    const signInState: AuthState = await waitFor(authService, (state: AuthState) =>
      state.matches({ authentication: { signedIn: { refreshTimer: { running: 'pending' } } } })
    )

    expect(signInState.context.user).not.toBeNull()
  })
})

describe('Sign in with email address ', () => {
  test('should reach an error state if network is unavailable', async () => {
    server.use(passwordlessEmailPasswordNetworkErrorHandler)

    authService.send({
      type: 'SIGNIN_PASSWORDLESS_EMAIL',
      email: faker.internet.email()
    })

    const state: AuthState = await waitFor(authService, (state: AuthState) =>
      state.matches({ authentication: { signedOut: { failed: 'server' } } })
    )

    expect(state.context.errors).toMatchInlineSnapshot(`
    {
      "authentication": {
        "error": "OK",
        "message": "Network Error",
        "status": 200,
      },
    }
    `)
  })
})
