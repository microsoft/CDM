import setuptools

with open("README.md", "r") as fh:
    long_description = fh.read()

setuptools.setup(
    name="commondatamodel-objectmodel",
    version="0.9.0preview3",
    author="Microsoft",
    #    author_email="author@example.com",
    description="Common Data Model Object Model library for Python",
    #    long_description=long_description,
    #    long_description_content_type="text/markdown",
    url="https://github.com/pypa/commondatamodel-objectmodel",
    packages=setuptools.find_packages(),
    classifiers=[
        "Programming Language :: Python :: 3.5",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent"
    ]
)
