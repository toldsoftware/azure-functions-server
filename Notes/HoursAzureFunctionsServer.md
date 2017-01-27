# 2017-01-02

## 16:00-18:30

- Setup Project
- Create asf cli tool

## 20:26-20:41

- FIX Test

## 15:00-16:09

- Change ASF to async

# 2017-01-19

## 8:30-10:18

- Use Webpack

## 10:19-11:00

- Configure Webpack for Node.js

# 2017-01-27

## 7:30-12:00
## 12:30-15:20

- Add Client Webpack
- Add Source Maps to Webpack
- Support Node Debugging

# Design

## Routes to use for default static file serving with CDN

- {default?}
    - Match all names of single path 
- {default:maxlength(0)?}
    - Default route to match only the empty route
- {*default}
    -  Matches everything