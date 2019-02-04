import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import styled from 'styled-components'
import { ResponsiveStack, Button } from 'serverless-design-system'
import { setItemSync, getItemSync } from 'src/utils/storage'
import { validateEmail } from 'src/utils/validator'
import EmailField from './EmailField'
import { Button as ButtonNew } from 'src/fragments/DesignSystem'
import { ExternalLink } from 'src/fragments'
const formId = 'whitepaper-download'
import formHandler from 'src/utils/formHandler'
const whitepaperFile =
  'https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/whitepapers/serverless-architecture-use-cases.pdf'

const StyledForm = styled.form`
  display: block;
  height: 100%;
  width: 100%;
`

const newsletterSubscribeAPI = process.env.GATSBY_NEWSLETTER_API

class NewsLetterForm extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      isSubscribed: false,
      isFetching: false,
    }
  }

  componentDidMount() {
    const user = getItemSync('profile')
    if (user) {
      this.emailField.value = user.email
    }
  }

  handleSubmit = e => {
    e.preventDefault()
    if (this.state.isFetching) return
    const { onSubmit } = this.props
    const email = this.emailField.value
    if (!validateEmail(email)) {
      alert('Woops! invalid email address') // eslint-disable-line
      return false
    }
    this.setState({
      isFetching: true,
      error: false,
    })

    const formData = {
      formId: formId,
      fields: {
        email,
      },
    }

    formHandler(formData)
      .then(res => {
        window.open(whitepaperFile)
        this.setState({
          isSubscribed: true,
          isFetching: false,
        })
      })
      .catch(e => {
        console.log('ERROR', e)
      })
    return false

    /*
    axios({
      method: 'post',
      url: newsletterSubscribeAPI,
      data: {
        email: email,
        name: '',
      },
    })
      .then(response => {
        if (response && response.data && response.data.created) {
          console.info('Newsletter subscription creation succeed') // eslint-disable-line
          // https://segment.com/academy/collecting-data/naming-conventions-for-clean-data/
          that.setState(
            {
              isSubscribed: true,
              isFetching: false,
            },
            () => {
              // trigger callback
              that.emailField.value = ''
              if (onSubmit) {
                onSubmit()
              }
            }
          )
          setItemSync('newsletterSubscribed', true)
          that.container.innerHTML = '<p>Thank you for subscribing!</p>'
        } else {
          console.error(
            'Newsletter subscription failed creation',
            response && response.data && response.data.message
              ? response.data.message
              : ''
          )
        }
      })
      .catch(error => {
        console.error(error) // eslint-disable-line
        that.setState({
          error: 'serviceDown',
        })
      })
      */
  }

  renderSubmitBtn = () => {
    const { btnComponent: ButtonComponent } = this.props

    if (ButtonComponent) {
      return <ButtonComponent disabled={this.state.isFetching} />
    }
  }

  render() {
    const {
      emailFieldProps,
      wrapperComponent: Wrapper,
      wrapperProps,
      formStyles,
    } = this.props

    return (
      <React.Fragment>
        {this.state.isSubscribed ? (
          <ExternalLink to={whitepaperFile}>
            <ButtonNew width={[323, 323, 400, 400, 383]} mt={[0, 0, 0, 0, 6]}>
              Thanks for your download!
            </ButtonNew>
          </ExternalLink>
        ) : (
          <StyledForm
            onSubmit={this.handleSubmit}
            style={formStyles}
            id={formId}
            action={whitepaperFile}
            method='get'
          >
            <Wrapper
              {...wrapperProps}
              ref={ref => {
                this.container = ReactDOM.findDOMNode(ref)
              }}
            >
              <React.Fragment>
                <EmailField
                  {...emailFieldProps}
                  ref={ref => {
                    this.emailField = ReactDOM.findDOMNode(ref)
                  }}
                />
                {this.renderSubmitBtn()}
              </React.Fragment>
            </Wrapper>
          </StyledForm>
        )}
      </React.Fragment>
    )
  }
}

NewsLetterForm.defaultProps = {
  emailFieldProps: {},
  submitBtnProps: {},
  formStyles: {},
  wrapperProps: { color: 'white', fontFamily: 'SoleilBk' },
  btnComponent: null,
  wrapperComponent: ResponsiveStack,
}

export default NewsLetterForm